import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { User, Loader2 } from 'lucide-react';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import InstructorLayout from '@/components/layout/instructor-layout';
import ChangePhoto from '@/components/modal/ChangePhoto';
import { instructorApi } from '@/services/axios/instructorApi';
import { InstructorProfile } from '@/types/schema';
import useProfile from '@/hooks/fetch-data/useProfile';
import FailedAlert from '@/components/alert/Failed';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditProfile() {
  const { toast } = useToast();
  const { profile, isLoading, profileMutate } = useProfile();
  const [isChanged, setIsChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [nameError, setNameError] = useState('');
  const [headlineError, setHeadlineError] = useState('');
  const [biographyError, setBiographyError] = useState('');
  const [profileData, setProfileData] = useState<Omit<InstructorProfile, 'picture'> | null>(null);

  useEffect(() => {
    if (profile) {
      setProfileData({ ...profile.data! });
    }
  }, [isLoading]);

  useEffect(() => {
    if (profile && profileData) {
      const changed = !(Object.keys(profileData) as (keyof Omit<InstructorProfile, 'picture'>)[]).every((key) => profileData[key] == profile.data![key]);
      setIsChanged(changed);
    }
  }, [profileData]);

  const handleChangeDisplayName = (value: string) => {
    setProfileData({ ...profileData!, displayName: value });
  };

  const handleChangeHeadline = (value: string) => {
    setProfileData({ ...profileData!, introduction: value });
  };

  const handleChangeBiography = (value: string) => {
    setProfileData({ ...profileData!, biography: value });
  };

  const handleChangeTwitterLink = (value: string) => {
    setProfileData({ ...profileData!, twitterLink: value });
  };

  const handleChangeLinkedinLink = (value: string) => {
    setProfileData({ ...profileData!, linkedinLink: value });
  };

  const handleChangeYoutubeLink = (value: string) => {
    setProfileData({ ...profileData!, youtubeLink: value });
  };

  const handleSaveProfile = async () => {
    let hasNameError = false,
      hasHeadlineError = false,
      hasBiographyError = false;
    const { displayName, introduction, twitterLink, linkedinLink, youtubeLink, biography } = profileData!;

    if (!displayName || (displayName && displayName.trim() === ''))
      (hasNameError = true), setNameError('Display name cannot be empty');
    else (hasNameError = false), setNameError('');

    if (!introduction || (introduction && introduction.trim() === ''))
      (hasHeadlineError = true), setHeadlineError('Headline cannot be empty');
    else (hasHeadlineError = false), setHeadlineError('');

    if (
      !biography ||
      (biography && ['<h1><br></h1>', '<h2><br></h2>', '<h3><br></h3>', '<p><br></p>'].includes(biography))
    )
      (hasBiographyError = true), setBiographyError('Biography cannot be empty');
    else (hasBiographyError = false), setBiographyError('');

    setSaveError('');
    if (hasNameError || hasHeadlineError || hasBiographyError) return;

    setSaving(true);
    const saveProfileResponse = await instructorApi.changeProfile({
      displayName: displayName as string,
      introduction: introduction as string,
      biography: biography as string,
      twitterLink: twitterLink,
      linkedinLink: linkedinLink,
      youtubeLink: youtubeLink,
    });
    setSaving(false);

    if (saveProfileResponse.error) {
      const messages = saveProfileResponse.message;
      if (typeof messages === 'string') setSaveError(messages);
      else setSaveError(messages[0]);
    } else {
      profileMutate();
      toast({
        variant: 'success',
        description: 'Saved profile successfully!',
      });
      setIsChanged(false);
    }
  };

  return (
    <div className="grow flex justify-center items-center">
      <div className="bg-white-primary w-[95%] h-[95%] shadow-lg rounded-xl overflow-y-scroll">
        <div className="px-10 py-8 flex flex-col gap-8">
          <Heading className="!font-medium">Instructor Profile</Heading>
          <div className="w-full flex flex-col gap-5">
            <div className="flex gap-5">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.data?.picture ? profile?.data?.picture : undefined} />
                <AvatarFallback className="bg-slate-300 text-white-primary text-center font-medium text-sm">
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 justify-center">
                <Text size="sm" className="font-medium !text-gray-600">
                  Profile picture
                </Text>
                <ChangePhoto
                  title={'Change Picture'}
                  field={'picture'}
                  object={profile}
                  isLoading={isLoading}
                  mutate={profileMutate}
                  apiHandler={instructorApi.changePicture}
                />
              </div>
            </div>

            <div className="w-[67%] h-[1px] bg-gray-300 border-0 dark:bg-gray-700"></div>

            <div className="flex gap-7">
              <div className="w-[35%] flex flex-col gap-4">
                <div className="w-full flex flex-col items-start gap-1">
                  <Text size="sm" className="font-medium !text-gray-600">
                    Display name<span className="text-red-500"> *</span>
                  </Text>
                  <Input
                    size="sm"
                    type="text"
                    placeholder="Enter your display name"
                    value={profileData?.displayName ? profileData?.displayName : undefined}
                    onChange={handleChangeDisplayName}
                  />
                  {nameError && (
                    <Text size="xs" as="p" className="text-red-400 font-medium">
                      {nameError}
                    </Text>
                  )}
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <Text size="sm" className="font-medium !text-gray-600">
                    Headline<span className="text-red-500"> *</span>
                  </Text>
                  <Input
                    size="sm"
                    type="text"
                    placeholder="Enter your headline"
                    value={profileData?.introduction ? profileData?.introduction : undefined}
                    onChange={handleChangeHeadline}
                  />
                  {headlineError && (
                    <Text size="xs" as="p" className="text-red-400 font-medium">
                      {headlineError}
                    </Text>
                  )}
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <Text size="sm" className="font-medium !text-gray-600">
                    Biography<span className="text-red-500"> *</span>
                  </Text>
                  <ReactQuill
                    theme="snow"
                    className="quill w-full"
                    style={{ minHeight: '220px' }}
                    value={profileData?.biography ? profileData?.biography : undefined}
                    onChange={handleChangeBiography}
                  />
                  {biographyError && (
                    <Text size="xs" as="p" className="text-red-400 font-medium mt-[40px]">
                      {biographyError}
                    </Text>
                  )}
                </div>
              </div>
              <div className="w-[30%] flex flex-col gap-4">
                <div className="w-full flex flex-col items-start gap-1">
                  <Text size="sm" className="font-medium !text-gray-600">
                    Twitter
                  </Text>
                  <Input
                    size="sm"
                    type="text"
                    placeholder="http://www.twitter.com/username"
                    value={profileData?.twitterLink ? profileData?.twitterLink : undefined}
                    onChange={handleChangeTwitterLink}
                  />
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <Text size="sm" className="font-medium !text-gray-600">
                    Linkedin
                  </Text>
                  <Input
                    size="sm"
                    type="text"
                    placeholder="http://www.linkedin.com/username"
                    value={profileData?.linkedinLink ? profileData?.linkedinLink : undefined}
                    onChange={handleChangeLinkedinLink}
                  />
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <Text size="sm" className="font-medium !text-gray-600">
                    Youtube
                  </Text>
                  <Input
                    size="sm"
                    type="text"
                    placeholder="http://www.youtube.com/username"
                    value={profileData?.youtubeLink ? profileData?.youtubeLink : undefined}
                    onChange={handleChangeYoutubeLink}
                  />
                </div>
              </div>
            </div>
            <div className={`flex flex-col gap-3 ${biographyError ? 'mt-[0px]' : 'mt-[40px]'}`}>
              <div className="w-[35%] flex flex-col items-center p-0">
                {saveError && <FailedAlert title={'Update profile failed'} message={saveError} />}
              </div>
              <Button
                size="sm"
                disabled={!isChanged || saving}
                className="w-[80px] bg-teal-secondary text-white-primary active:scale-95"
                onClick={handleSaveProfile}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

EditProfile.getLayout = function (page: React.ReactNode) {
  return <InstructorLayout>{page}</InstructorLayout>;
};
