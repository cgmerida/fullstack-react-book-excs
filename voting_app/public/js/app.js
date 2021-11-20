const ProductList = () => {
  const { useState, useEffect } = React;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(Seed.products.sort((a, b) => b.votes - a.votes));
  }, [])

  const handleProductUpVote = (productId) => {
    let newProds = products.map((p) =>
      p.id === productId ? (p.votes = p.votes + 1, p) : p
    );

    setProducts(newProds.sort((a, b) => b.votes - a.votes));
  }

  let tempProds = products.slice();

  const productComponents = tempProds.map((p) =>
    <Product key={p.id} product={p} onVote={handleProductUpVote} />
  );

  return (
    <div className='ui unstackable items'>
      {productComponents}
    </div>
  )
}


const Product = ({ product, onVote }) => {
  return (
    <div className='item'>
      <div className='image'>
        <img src={product.productImageUrl} />
      </div>
      <div className='middle aligned content'>
        <div className='header'>
          <a onClick={() => onVote(product.id)}>
            <i className='large caret up icon' />
          </a>
          {product.votes}
        </div>
        <div className='description'>
          <a href={product.url}>
            {product.title}
          </a>
          <p>
            {product.description}
          </p>
        </div>
        <div className='extra'>
          <span>Submitted by:</span>
          <img
            className='ui avatar image'
            src={product.submitterAvatarUrl}
          />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <ProductList />,
  document.getElementById('content')
);
