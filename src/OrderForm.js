import { useState } from "react";

const products = [
  { id: 1, bean: "ブラジルNo.2カルモデミナス" },
  { id: 2, bean: "モカコチャレG1ウォッシュド" },
  { id: 3, bean: "ケニアAA" },
];

const roasts = ["浅煎り", "中煎り", "中深煎り", "深煎り", "相談希望", "おすすめ"];

function OrderForm() {
  const [name, setName] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedBean, setSelectedBean] = useState(products[0].bean);
  const [selectedRoast, setSelectedRoast] = useState(roasts[0]);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");

  // カートに追加
  const addToCart = () => {
    setCart(prev => {
      const exist = prev.find(item => item.bean === selectedBean && item.roast === selectedRoast);
      if (exist) {
        return prev.map(item =>
          item.bean === selectedBean && item.roast === selectedRoast
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        return [...prev, { bean: selectedBean, roast: selectedRoast, qty }];
      }
    });
  };

  // 数量変更
  const changeQty = (index, newQty) => {
    if (newQty < 1) return;
    setCart(prev => prev.map((item, i) => (i === index ? { ...item, qty: newQty } : item)));
  };

  // 削除
  const removeItem = (index) => setCart(prev => prev.filter((_, i) => i !== index));

  // 注文送信
  const sendOrder = async () => {
    if (!name) {
      setMessage("お名前を入力してください");
      return;
    }
    if (cart.length === 0) {
      setMessage("カートが空です");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/sendOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, items: cart }),
      });

      const text = await res.text();
      setMessage(text);

      if (res.ok) setCart([]);
    } catch (err) {
      console.error(err);
      setMessage("送信に失敗しました");
    }
  };

  return (
    <div>
      <h2>商品を選択</h2>

      <label>
        お名前：
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </label>

      <label>
        豆：
        <select value={selectedBean} onChange={e => setSelectedBean(e.target.value)}>
          {products.map(p => <option key={p.id}>{p.bean}</option>)}
        </select>
      </label>

      <label>
        焙煎：
        <select value={selectedRoast} onChange={e => setSelectedRoast(e.target.value)}>
          {roasts.map(r => <option key={r}>{r}</option>)}
        </select>
      </label>

      <label>
        数量：
        <input type="number" value={qty} min={1} onChange={e => setQty(Number(e.target.value))} />
      </label>

      <button onClick={addToCart}>カートに追加</button>

      <h3>カート</h3>
      {cart.length === 0 && <p>カートは空です</p>}
      <ul>
        {cart.map((item, i) => (
          <li key={i}>
            {item.bean} - {item.roast} - {item.qty}個
            <input
              type="number"
              value={item.qty}
              min={1}
              onChange={(e) => changeQty(i, Number(e.target.value))}
              style={{ width: "50px", marginLeft: "10px" }}
            />
            <button onClick={() => removeItem(i)}>削除</button>
          </li>
        ))}
      </ul>

      {cart.length > 0 && <button onClick={sendOrder}>注文する</button>}

      <p>{message}</p>
    </div>
  );
}

export default OrderForm;