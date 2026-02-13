import React, { useEffect, useState } from 'react';
import axios from "axios";
import ProductForm from '../../components/admin//productForm';

function AdminProduct() {

    const url = import.meta.env.VITE_BACKEND_URL;

    const [product, setProduct] = useState([]);
    const [showForm, setShowForm] = useState(false)


    const fetchProduct = async () => {
        try {
            const getUrl = url + "/product/get";
            const res = await axios.get(getUrl);
            if (res.data.status) {
                setProduct(res.data.product);
            }
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        fetchProduct()
    }, [])
    return (
        <div>

            <button className='bg-blue-800 p-2 text-white' onClick={() => setShowForm(!showForm)} >{showForm ? 'Cancel' : 'Add'}</button>

            {
                showForm && <ProductForm fetchProduct={fetchProduct} setShowForm={setShowForm} />
            }

            <table className='w-full'>
                <thead className='border bg-yellow-400'>
                    <tr>
                        <td>Name</td>
                        <td>price</td>
                        <td>Description</td>
                        <td>image</td>
                    </tr>
                </thead>
                <tbody>

                    {product?.length > 0 &&
                        product.map((ele) => (
                            <tr>
                                <td>{ele?.name}</td>
                                <td>{ele.price}</td>
                                <td>{ele.description}</td>
                                <td>
                                    <img className='h-12 w-12' src={ele.image} alt="" />
                                </td>
                            </tr>
                        ))}

                </tbody>
            </table>
        </div>
    )
}

export default AdminProduct