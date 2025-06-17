import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";
import { toast } from "react-toastify";

export default function DeleteCase({ show, onClose, caseId, caseName, onSuccess }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://43.250.40.133:5005/api/v1/cases/${caseId}`,  {
      headers: {
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzE4M2UzMDRkYWI3NzA4NDE3ZDM1NyIsImlhdCI6MTc0OTEyOTA2NCwiZXhwIjoxNzUxNzIxMDY0fQ.CUIQgfi6wN15fTDCN0bT8ycSD6v6S_72Ive9Zu8sgZY"}`,
        }
      });
      toast.success(`${caseName} deleted successfully`);
      onSuccess(); 
      onClose();
    } catch (error) {
      toast.error("Failed to delete case");
    }
  };

  return (
   

      <Modal
        show={show}
        size="md"
        popup
        onClose={onClose}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600 text-left">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-700 text-left mb-4">
              Are you sure you want to delete case <strong>{caseName}</strong>?</p>
             
            <div className="flex justify-end gap-4">
              <Button color="gray"onClick={onClose}>
                Cancel
              </Button>
              <Button color="failure" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
  );
}
