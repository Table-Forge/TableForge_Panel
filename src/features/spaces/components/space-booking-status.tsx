import { UserStatus } from "@/src/components/user-status/user-status";
import { useBookingStatusEnum } from "@/src/features/spaces/hooks/enums/use-spaces-enums";

interface IProps {
  value: string;
}

export function SpaceBookingStatus({ value }: IProps) {
  const { statusEnum } = useBookingStatusEnum();

  return <UserStatus value={value} options={statusEnum} />;
}
