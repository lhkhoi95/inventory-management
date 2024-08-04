import { CircleButton } from "./Buttons";
import { closeIcon } from "./Icons";

export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-90 text-right text-gray-800">
      <div className="w-96 max-w-lg rounded-lg bg-purple-100 p-4">
        <CircleButton onClick={onClose}>{closeIcon}</CircleButton>
        {children}
      </div>
    </div>
  );
}
