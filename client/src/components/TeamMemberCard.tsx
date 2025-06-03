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
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-500/10 group bg-slate-800 border-slate-700">
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
            <div className="h-[250px] bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <Avatar className="w-32 h-32">
                <AvatarFallback className="text-3xl bg-gradient-to-br from-[#7B3FE4] to-[#3FA4E4] text-white">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        
        <CardContent className="p-5">
          <div className="space-y-2">
            <div>
              <h3 className="text-xl font-bold text-white">
                {member.name}
                {member.qualifications && (
                  <span className="ml-2 text-sm font-semibold text-slate-400">
                    {member.qualifications}
                  </span>
                )}
              </h3>
              <p className="text-[#7B3FE4] font-medium">
                {member.role}
              </p>
            </div>
            
            <p className="text-slate-300 line-clamp-3">
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
                className="text-slate-400 hover:text-[#7B3FE4] transition-colors"
              >
                <Linkedin size={18} />
              </a>
            )}
            
            {member.socialLinks?.twitter && (
              <a 
                href={member.socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#7B3FE4] transition-colors"
              >
                <Twitter size={18} />
              </a>
            )}
            
            {member.socialLinks?.email && (
              <a 
                href={`mailto:${member.socialLinks.email}`}
                className="text-slate-400 hover:text-[#7B3FE4] transition-colors"
              >
                <Mail size={18} />
              </a>
            )}
          </div>
          
          <Button 
              variant="outline" 
              size="sm"
              className="text-xs border-[#7B3FE4] text-[#7B3FE4] hover:bg-[#7B3FE4] hover:text-white transition-all"
              onClick={() => setIsOpen(true)}
            >
              <span className="mr-1">Read More</span>
              <ExternalLink size={12} />
            </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              {member.name} {member.qualifications && <span className="text-lg text-slate-400">({member.qualifications})</span>}
            </DialogTitle>
            <DialogDescription className="text-lg text-[#7B3FE4]">
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
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg aspect-square flex items-center justify-center">
                  <Avatar className="w-32 h-32">
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-[#7B3FE4] to-[#3FA4E4] text-white">
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
                    className="text-slate-400 hover:text-[#7B3FE4] transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                
                {member.socialLinks?.twitter && (
                  <a 
                    href={member.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#7B3FE4] transition-colors"
                  >
                    <Twitter size={24} />
                  </a>
                )}
                
                {member.socialLinks?.email && (
                  <a 
                    href={`mailto:${member.socialLinks.email}`}
                    className="text-slate-400 hover:text-[#7B3FE4] transition-colors"
                  >
                    <Mail size={24} />
                  </a>
                )}
              </div>
            </div>
            
            <div className="col-span-2 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-white">
                  Biography
                </h3>
                <p className="text-slate-300">
                  {member.biography}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-1 text-white">
                  Interests
                </h3>
                <p className="text-slate-300">
                  {member.interests}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-[#7B3FE4] text-[#7B3FE4] hover:bg-[#7B3FE4] hover:text-white"
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