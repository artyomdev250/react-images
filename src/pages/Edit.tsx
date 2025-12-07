import { useParams } from "react-router-dom";
import EditForm from "../components/edit/EditForm";

function Edit() {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return <div className="text-red-500">Product id is missing.</div>;
    }

    return (
        <div className="max-w-[1212px] mx-auto">
            <EditForm productId={id} />
        </div>
    );
}

export default Edit;
