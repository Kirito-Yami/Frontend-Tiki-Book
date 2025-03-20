import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import SeeBookDetail from "components/client/book/see.book.detail.tsx";
import {App} from "antd";
import {getBookByIdAPI} from "services/api.ts";

const BookPage = () => {
    const { id } = useParams();

    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);

    const {notification} = App.useApp();

    useEffect(() => {
        if (id) {
            const fetchBookById = async () => {
                const res = await getBookByIdAPI(id);
                if (res && res.data) {
                    setCurrentBook(res.data);
                } else {
                    notification.error({
                        message: 'Đã có lỗi xảy ra',
                        description: res.message
                    })
                }
            }
            fetchBookById();
        }
    }, [id]);
    return (
        <>
            <SeeBookDetail
                currentBook={currentBook}
            />
        </>
    )
}

export default BookPage;