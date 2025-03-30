import { Button } from "@/components/ui/button";
import { getFullImageUrl } from "@/utils/helperFunctions";
import { useRef, useEffect } from "react";

interface ImageModalProps {
  isOpen: boolean;
  closeModal: () => void;
  imageUrl: string;
}

export const ImageModal = ({
  isOpen,
  closeModal,
  imageUrl,
}: ImageModalProps) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  // Prevent closing modal on pressing 'Esc'
  const preventClose = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
    }
  };

  useEffect(() => {
    const modalElement = modalRef.current;

    if (modalElement) {
      if (isOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isOpen]);

  return (
    <dialog
      ref={modalRef}
      className="m-auto sm:w-[600px] rounded-lg border border-gray-300 p-6 backdrop:bg-black/75"
      onKeyDown={preventClose}
    >
      <div className="border-2 rounded-lg p-2 flex justify-center">
        <img src={getFullImageUrl(imageUrl)} alt="proof image" />
      </div>
      <Button className="w-full mt-5" onClick={closeModal}>
        Đóng
      </Button>
    </dialog>
  );
};
