import { ChatBubbleBottomCenterTextIcon as MessageOutline } from "@heroicons/react/24/outline";
import { TrashIcon as TrashOutline } from "@heroicons/react/24/outline";
import { PencilSquareIcon as PencilOutline } from "@heroicons/react/24/outline";

function IconButton({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon: "edit" | "delete" | "comment";
  children?: React.ReactNode;
}) {
  const IconComponent = {
    edit: PencilOutline,
    delete: TrashOutline,
    comment: MessageOutline,
  }[icon];

  return (
    <button
      onClick={onClick}
      className={`text-slate-500 dark:text-slate-300 font-medium cursor-pointer ${icon === "comment" ? "flex items-center gap-1" : ""}`}
    >
      {children}
      <IconComponent className="h-5 w-5" />
    </button>
  );
}

export default IconButton;
