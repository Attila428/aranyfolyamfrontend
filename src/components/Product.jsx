import Button from "./button"

export default function Product({ allProduct }) {
    return (
        <>
            {allProduct?.map(product => (

                <div className="container d-flex justify-content-center col-12 col-md-6 col-lg-4 col-xl-3" key={product.product_id}>
                    <div className="card bg-dark text-white rounded rounded-4">
                        <div className="p-3">
                            <img src={product.product_image} className="img-fluid rounded-4 rounded" alt="Nem jeleníthető meg a kép" />
                        </div>
                        <div className="card-body">
                            <div className="text-danger fw-bold text-uppercase fs-5">{product.category_name}</div>
                            <div className="fs-3 fw-bold mb-3 fs-4">{product.product_name}</div>
                            <span className="bg-danger rounded-3 fw-bold text-white px-3 py-1 fs-6">Készleten: {product.product_stock}db</span>
                            <div className="d-flex justify-content-between flex-md-row flex-column gap-3 mt-5">
                                <div className="fs-4 fw-bold">
                                    <span className="text-white fw-bold fs-5">{product.product_price}</span>
                                    <span className="text-danger fw-bold fs-5">Ft</span>
                                </div>
                                <div>
                                    <Button buttonClass={"btn btn-danger fw-bold fs-6"} content={"Kosárba"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            ))}
        </>
    )
}
