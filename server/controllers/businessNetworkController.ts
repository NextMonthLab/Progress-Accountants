import { Request, Response } from 'express';
import { db } from "../db";
import { 
  businessProfiles, 
  businessPosts, 
  postComments, 
  follows, 
  messages,
  insertBusinessProfileSchema,
  insertBusinessPostSchema,
  insertCommentSchema,
  insertFollowSchema,
  insertMessageSchema
} from '@shared/business_network';
import { eq, desc, and, like, or, inArray } from 'drizzle-orm';
import { ZodError } from 'zod';

// Get the current user's business profile
export const getMyProfile = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const userId = req.user.id;
    
    const profile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId),
      with: {
        user: {
          columns: {
            username: true,
            name: true,
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching business profile:', error);
    res.status(500).json({ error: 'Failed to fetch business profile' });
  }
};

// Create a business profile for the current user
export const createBusinessProfile = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const userId = req.user.id;
    
    // Check if user already has a profile
    const existingProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'User already has a business profile' });
    }

    // Validate request body
    const validatedData = insertBusinessProfileSchema.parse({
      ...req.body,
      userId,
      tenantId: req.user.tenantId || null
    });

    // Create profile
    const [profile] = await db.insert(businessProfiles)
      .values(validatedData)
      .returning();

    res.status(201).json(profile);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating business profile:', error);
    res.status(500).json({ error: 'Failed to create business profile' });
  }
};

// Update a business profile
export const updateBusinessProfile = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const userId = req.user.id;
    
    // Check if user has a profile
    const existingProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!existingProfile) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    // Only allow updating certain fields
    const allowedUpdates = {
      businessName: req.body.businessName,
      industry: req.body.industry,
      description: req.body.description,
      location: req.body.location,
      website: req.body.website,
      logo: req.body.logo,
      coverImage: req.body.coverImage,
      founded: req.body.founded,
      size: req.body.size,
      specialties: req.body.specialties
    };

    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    // Update profile
    const [updatedProfile] = await db.update(businessProfiles)
      .set({
        ...allowedUpdates,
        updatedAt: new Date()
      })
      .where(eq(businessProfiles.id, existingProfile.id))
      .returning();

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating business profile:', error);
    res.status(500).json({ error: 'Failed to update business profile' });
  }
};

// Get all business profiles
export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    
    let profiles;
    
    if (search) {
      profiles = await db.query.businessProfiles.findMany({
        where: or(
          like(businessProfiles.businessName, `%${search}%`),
          like(businessProfiles.industry, `%${search}%`)
        ),
        with: {
          user: {
            columns: {
              username: true,
              name: true,
            }
          }
        },
        orderBy: [desc(businessProfiles.followers)]
      });
    } else {
      profiles = await db.query.businessProfiles.findMany({
        with: {
          user: {
            columns: {
              username: true,
              name: true,
            }
          }
        },
        orderBy: [desc(businessProfiles.followers)],
        limit: 20
      });
    }

    res.json(profiles);
  } catch (error) {
    console.error('Error fetching business profiles:', error);
    res.status(500).json({ error: 'Failed to fetch business profiles' });
  }
};

// Get a specific business profile by ID
export const getProfileById = async (req: Request, res: Response) => {
  try {
    const profileId = parseInt(req.params.id);
    if (isNaN(profileId)) {
      return res.status(400).json({ error: 'Invalid profile ID' });
    }

    const profile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.id, profileId),
      with: {
        user: {
          columns: {
            username: true,
            name: true,
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching business profile:', error);
    res.status(500).json({ error: 'Failed to fetch business profile' });
  }
};

// Get all posts for the feed
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await db.query.businessPosts.findMany({
      with: {
        profile: true
      },
      orderBy: [desc(businessPosts.createdAt)],
      limit: 20
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get posts from followed businesses
export const getFollowingPosts = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const userId = req.user.id;
    
    // Get the user's business profile
    const myProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!myProfile) {
      return res.json([]);
    }
    
    // Get IDs of profiles the user follows
    const followedProfiles = await db.select({ followingId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, myProfile.id));
    
    if (followedProfiles.length === 0) {
      return res.json([]);
    }
    
    const followingIds = followedProfiles.map(f => f.followingId);
    
    // Get posts from followed profiles
    const posts = await db.query.businessPosts.findMany({
      where: inArray(businessPosts.profileId, followingIds),
      with: {
        profile: true
      },
      orderBy: [desc(businessPosts.createdAt)],
      limit: 20
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching following posts:', error);
    res.status(500).json({ error: 'Failed to fetch following posts' });
  }
};

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const userId = req.user.id;
    
    // Get the user's business profile
    const myProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!myProfile) {
      return res.status(404).json({ error: 'Business profile not found' });
    }
    
    // Validate request body
    const validatedData = insertBusinessPostSchema.parse({
      ...req.body,
      profileId: myProfile.id,
      mediaUrls: req.body.mediaUrls || []
    });

    // Create post
    const [post] = await db.insert(businessPosts)
      .values(validatedData)
      .returning();

    res.status(201).json(post);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Like a post
export const likePost = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    // Get the post
    const post = await db.query.businessPosts.findFirst({
      where: eq(businessPosts.id, postId)
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment likes
    const [updatedPost] = await db.update(businessPosts)
      .set({
        likes: post.likes + 1,
        updatedAt: new Date()
      })
      .where(eq(businessPosts.id, postId))
      .returning();

    res.json(updatedPost);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
};

// Comment on a post
export const commentOnPost = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const userId = req.user.id;
    
    // Get the user's business profile
    const myProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!myProfile) {
      return res.status(404).json({ error: 'Business profile not found' });
    }
    
    // Get the post
    const post = await db.query.businessPosts.findFirst({
      where: eq(businessPosts.id, postId)
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Validate request body
    const validatedData = insertCommentSchema.parse({
      postId,
      profileId: myProfile.id,
      content: req.body.content
    });

    // Create comment
    const [comment] = await db.insert(postComments)
      .values(validatedData)
      .returning();
    
    // Increment post comments count
    await db.update(businessPosts)
      .set({
        comments: post.comments + 1,
        updatedAt: new Date()
      })
      .where(eq(businessPosts.id, postId));

    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Get comments for a post
export const getPostComments = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const comments = await db.query.postComments.findMany({
      where: eq(postComments.postId, postId),
      with: {
        profile: true
      },
      orderBy: [desc(postComments.createdAt)]
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Follow a business profile
export const followProfile = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const followingId = parseInt(req.params.id);
    if (isNaN(followingId)) {
      return res.status(400).json({ error: 'Invalid profile ID' });
    }
    
    const userId = req.user.id;
    
    // Get the user's business profile
    const myProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!myProfile) {
      return res.status(404).json({ error: 'Your business profile not found' });
    }
    
    // Get the profile to follow
    const profileToFollow = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.id, followingId)
    });

    if (!profileToFollow) {
      return res.status(404).json({ error: 'Profile to follow not found' });
    }
    
    // Check if already following
    const existingFollow = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, myProfile.id),
        eq(follows.followingId, followingId)
      )
    });

    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this profile' });
    }
    
    // Create follow relationship
    const [follow] = await db.insert(follows)
      .values({
        followerId: myProfile.id,
        followingId
      })
      .returning();
    
    // Update follower/following counts
    await db.update(businessProfiles)
      .set({
        following: myProfile.following + 1,
        updatedAt: new Date()
      })
      .where(eq(businessProfiles.id, myProfile.id));
    
    await db.update(businessProfiles)
      .set({
        followers: profileToFollow.followers + 1,
        updatedAt: new Date()
      })
      .where(eq(businessProfiles.id, followingId));

    res.status(201).json(follow);
  } catch (error) {
    console.error('Error following profile:', error);
    res.status(500).json({ error: 'Failed to follow profile' });
  }
};

// Unfollow a business profile
export const unfollowProfile = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const followingId = parseInt(req.params.id);
    if (isNaN(followingId)) {
      return res.status(400).json({ error: 'Invalid profile ID' });
    }
    
    const userId = req.user.id;
    
    // Get the user's business profile
    const myProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!myProfile) {
      return res.status(404).json({ error: 'Your business profile not found' });
    }
    
    // Get the profile to unfollow
    const profileToUnfollow = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.id, followingId)
    });

    if (!profileToUnfollow) {
      return res.status(404).json({ error: 'Profile to unfollow not found' });
    }
    
    // Check if following
    const existingFollow = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, myProfile.id),
        eq(follows.followingId, followingId)
      )
    });

    if (!existingFollow) {
      return res.status(400).json({ error: 'Not following this profile' });
    }
    
    // Delete follow relationship
    await db.delete(follows)
      .where(eq(follows.id, existingFollow.id));
    
    // Update follower/following counts
    await db.update(businessProfiles)
      .set({
        following: Math.max(0, myProfile.following - 1),
        updatedAt: new Date()
      })
      .where(eq(businessProfiles.id, myProfile.id));
    
    await db.update(businessProfiles)
      .set({
        followers: Math.max(0, profileToUnfollow.followers - 1),
        updatedAt: new Date()
      })
      .where(eq(businessProfiles.id, followingId));

    res.json({ success: true });
  } catch (error) {
    console.error('Error unfollowing profile:', error);
    res.status(500).json({ error: 'Failed to unfollow profile' });
  }
};

// Check if following a profile
export const checkFollowing = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const followingId = parseInt(req.params.id);
    if (isNaN(followingId)) {
      return res.status(400).json({ error: 'Invalid profile ID' });
    }
    
    const userId = req.user.id;
    
    // Get the user's business profile
    const myProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!myProfile) {
      return res.json({ following: false });
    }
    
    // Check if following
    const existingFollow = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, myProfile.id),
        eq(follows.followingId, followingId)
      )
    });

    res.json({ following: !!existingFollow });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ error: 'Failed to check follow status' });
  }
};

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const userId = req.user.id;
    
    // Get the user's business profile
    const myProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!myProfile) {
      return res.status(404).json({ error: 'Your business profile not found' });
    }
    
    // Validate request body
    const validatedData = insertMessageSchema.parse({
      senderId: myProfile.id,
      receiverId: req.body.receiverId,
      content: req.body.content
    });
    
    // Check if receiver exists
    const receiverProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.id, validatedData.receiverId)
    });

    if (!receiverProfile) {
      return res.status(404).json({ error: 'Receiver profile not found' });
    }
    
    // Create message
    const [message] = await db.insert(messages)
      .values(validatedData)
      .returning();

    res.status(201).json(message);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get conversations
export const getConversations = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const userId = req.user.id;
    
    // Get the user's business profile
    const myProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!myProfile) {
      return res.json([]);
    }

    // Get all profiles the user has messaged with
    const sentMessages = await db.query.messages.findMany({
      where: eq(messages.senderId, myProfile.id),
      with: {
        receiver: true
      },
      orderBy: [desc(messages.createdAt)]
    });

    const receivedMessages = await db.query.messages.findMany({
      where: eq(messages.receiverId, myProfile.id),
      with: {
        sender: true
      },
      orderBy: [desc(messages.createdAt)]
    });

    // Combine and de-duplicate conversations by profile
    const conversations = new Map();

    // Add sent messages
    for (const msg of sentMessages) {
      if (!conversations.has(msg.receiverId)) {
        conversations.set(msg.receiverId, {
          profile: msg.receiver,
          lastMessage: msg,
          unreadCount: 0
        });
      }
    }

    // Add received messages
    for (const msg of receivedMessages) {
      if (!conversations.has(msg.senderId)) {
        conversations.set(msg.senderId, {
          profile: msg.sender,
          lastMessage: msg,
          unreadCount: msg.read ? 0 : 1
        });
      } else {
        // Update unread count if this received message is newer
        const conv = conversations.get(msg.senderId);
        if (!msg.read && new Date(msg.createdAt) > new Date(conv.lastMessage.createdAt)) {
          conv.unreadCount += 1;
          conv.lastMessage = msg;
          conversations.set(msg.senderId, conv);
        }
      }
    }

    // Sort by most recent message
    const result = Array.from(conversations.values())
      .sort((a, b) => 
        new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      );

    res.json(result);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Get messages with a specific business profile
export const getMessages = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const profileId = parseInt(req.params.id);
    if (isNaN(profileId)) {
      return res.status(400).json({ error: 'Invalid profile ID' });
    }
    
    const userId = req.user.id;
    
    // Get the user's business profile
    const myProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!myProfile) {
      return res.json([]);
    }
    
    // Get messages
    const messageList = await db.query.messages.findMany({
      where: or(
        and(
          eq(messages.senderId, myProfile.id),
          eq(messages.receiverId, profileId)
        ),
        and(
          eq(messages.senderId, profileId),
          eq(messages.receiverId, myProfile.id)
        )
      ),
      orderBy: [desc(messages.createdAt)]
    });

    // Mark received messages as read
    const unreadMsgIds = messageList
      .filter(msg => !msg.read && msg.receiverId === myProfile.id)
      .map(msg => msg.id);
    
    if (unreadMsgIds.length > 0) {
      await db.update(messages)
        .set({ read: true })
        .where(inArray(messages.id, unreadMsgIds));
    }

    res.json(messageList.reverse()); // Return in chronological order
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};