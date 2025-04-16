import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';
import { TeamMember } from '@/lib/teamMembers';

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };
  
  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-lg group">
        <div className="relative overflow-hidden">
          {/* If we have a photo, display it with a zoom effect on hover */}
          {member.photoUrl ? (
            <div className="h-[250px] overflow-hidden">
              <img 
                src={member.photoUrl} 
                alt={`${member.name} - ${member.role}`}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ) : member.placeholderComponent ? (
            <div className="h-[250px] overflow-hidden">
              {React.createElement(member.placeholderComponent)}
            </div>
          ) : (
            <div className="h-[250px] bg-gray-200 flex items-center justify-center">
              <Avatar className="w-32 h-32">
                <AvatarFallback className="text-3xl" style={{ backgroundColor: 'var(--navy, #0F172A)', color: 'white' }}>
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        
        <CardContent className="p-5">
          <div className="space-y-2">
            <div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--navy, #0F172A)' }}>
                {member.name}
                {member.qualifications && (
                  <span className="ml-2 text-sm font-semibold text-gray-500">
                    {member.qualifications}
                  </span>
                )}
              </h3>
              <p className="text-orange-600 font-medium" style={{ color: 'var(--orange, #F59E0B)' }}>
                {member.role}
              </p>
            </div>
            
            <p className="text-gray-600 line-clamp-3">
              {member.biography}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center p-5 pt-0">
          <div className="flex space-x-2">
            {member.socialLinks?.linkedin && (
              <a 
                href={member.socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            )}
            
            {member.socialLinks?.twitter && (
              <a 
                href={member.socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-sky-500 transition-colors"
              >
                <Twitter size={18} />
              </a>
            )}
            
            {member.socialLinks?.email && (
              <a 
                href={`mailto:${member.socialLinks.email}`}
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <Mail size={18} />
              </a>
            )}
          </div>
          
          <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => setIsOpen(true)}
              style={{ borderColor: 'var(--navy, #0F172A)', color: 'var(--navy, #0F172A)' }}
            >
              <span className="mr-1">Read More</span>
              <ExternalLink size={12} />
            </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ color: 'var(--navy, #0F172A)' }}>
              {member.name} {member.qualifications && <span className="text-lg">({member.qualifications})</span>}
            </DialogTitle>
            <DialogDescription className="text-lg" style={{ color: 'var(--orange, #F59E0B)' }}>
              {member.role}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              {member.photoUrl ? (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={member.photoUrl} 
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ) : member.placeholderComponent ? (
                <div className="rounded-lg overflow-hidden aspect-square">
                  {React.createElement(member.placeholderComponent)}
                </div>
              ) : (
                <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
                  <Avatar className="w-32 h-32">
                    <AvatarFallback className="text-3xl" style={{ backgroundColor: 'var(--navy, #0F172A)', color: 'white' }}>
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              
              {/* Social links */}
              <div className="mt-4 flex space-x-4 justify-center">
                {member.socialLinks?.linkedin && (
                  <a 
                    href={member.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                
                {member.socialLinks?.twitter && (
                  <a 
                    href={member.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-sky-500 transition-colors"
                  >
                    <Twitter size={24} />
                  </a>
                )}
                
                {member.socialLinks?.email && (
                  <a 
                    href={`mailto:${member.socialLinks.email}`}
                    className="text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <Mail size={24} />
                  </a>
                )}
              </div>
            </div>
            
            <div className="col-span-2 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--navy, #0F172A)' }}>
                  Biography
                </h3>
                <p className="text-gray-700">
                  {member.biography}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--navy, #0F172A)' }}>
                  Interests
                </h3>
                <p className="text-gray-700">
                  {member.interests}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TeamMemberCard;