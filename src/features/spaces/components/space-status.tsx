import { UserStatus } from "@/src/components/user-status/user-status";
import { useSpaceStatusEnum } from "@/src/features/spaces/hooks/enums/use-spaces-enums";

interface IProps {
  value: string;
}

export function SpaceStatus({ value }: IProps) {
  const { statusEnum } = useSpaceStatusEnum();

  return <UserStatus value={value} options={statusEnum} />;
}
