import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

type UserAvatar = {
  userName: string;
  avatarUrl?: string;
};

const UserAvatar = ({ userName, avatarUrl }: UserAvatar) => {
  if (!avatarUrl) {
    return (
      <Avatar>
        <AvatarFallback className="text-white bg-primary">
          {userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback className="text-white bg-primary">
        {userName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
