import AppLayout from "@/components/Layouts/AppLayout";
import React, {useState} from "react";
import Modal from "react-modal";

export default function Report() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <AppLayout>
            <div className="py-8">
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
            </div>
        </AppLayout>
    );
}