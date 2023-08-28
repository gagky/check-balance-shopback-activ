import React, { FC, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import { useForm } from 'react-hook-form';
import Terser from 'terser';

function minifyJavaScript(inputCode) {
  const options = {
    // Your custom minification options go here
    mangle: {
      toplevel: true,
    },
    compress: {
      drop_console: true,
    },
    output: {
      comments: false,
    },
  };

  const minifiedCode = Terser.minify(inputCode, options);
  if (minifiedCode.error) {
    console.log(minifiedCode.error);
    throw minifiedCode.error;
  }

  return minifiedCode.code;
}

function simulateTyping(inputElement, text) {
  for (const char of text) {
    const event = new KeyboardEvent('keydown', { key: char });
    inputElement.dispatchEvent(event);

    inputElement.value += char;

    const inputEvent = new InputEvent('input', {
      inputType: 'insertText',
      data: char,
    });
    inputElement.dispatchEvent(inputEvent);

    const keyupEvent = new KeyboardEvent('keyup', { key: char });
    inputElement.dispatchEvent(keyupEvent);
  }
}

const App: FC = () => {
  const [data, setData] = useState(null);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => setData(data);

  const extracted = useMemo(() => {
    console.log(data);
    if (!data) return data;
    const { cardData } = data;
    const matched = /CARD:(.+)PCN:(.+)CVV:(.+)PIN:(.+)EXPIRY:(.+)/.exec(
      cardData
    );
    if (!matched) return data;
    const [, cardNumber, pcn, cvv, pin, expiry] = matched;
    const extracted = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      // pcn: pcn.replace(/\s/g, ''),
      cvv: cvv.replace(/\s/g, ''),
      // pin: pin.replace(/\s/g, ''),
      expirationMonth: expiry.split('/')[1],
      expirationYear: expiry.split('/')[2].slice(-2),
      // expiry: /\d+\/(\d+{2})\/\d{2}(\d{2})/.exec(expiry),
    };
    return extracted;
  }, [data]);

  const scripts = useMemo(() => {
    const scripts = [simulateTyping.toString()];
    if (extracted)
      for (const [key, value] of Object.entries(extracted)) {
        const formattedString = `simulateTyping(document.querySelector('input[name="${key}"]'), "${value}")`;
        scripts.push(formattedString);
      }
    return scripts;
  }, [extracted]);

  return (
    <React.Fragment>
      {/* <pre>{JSON.stringify(extracted, null, 2)}</pre> */}
      {scripts && scripts.map((s) => <pre>{s}</pre>)}
      <pre>{`javascript:${minifyJavaScript(simulateTyping.toString())}`}</pre>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h1 className="form-heading">
          Check balanace for Shopback Activ prepaid card
        </h1>
        <h2>Steps</h2>
        <ol>
          <li>Open "Account" in Shopback App</li>
          <li>Open "Gift cards & Vouchers"</li>
          <li>Select and click "See voucher"</li>
          <li>
            Select and copy the text in black card. It should includes the text
            "CARD: .... PIN: ... EXPIRY: ...
          </li>
        </ol>
        <input
          className="form-control"
          type="text"
          placeholder="Copy and paste card data here"
          maxLength={150}
          ref={register({ required: true, maxLength: 150 })}
          name="cardData"
        />
        {/* <input
          className="form-control"
          type="text"
          placeholder="First name"
          maxLength={15}
          ref={register({ required: true, maxLength: 15 })}
          name="firstName"
        />

        <input
          className="form-control"
          type="text"
          placeholder="Last name"
          maxLength={15}
          ref={register({ required: true, maxLength: 15 })}
          name="lastName"
        />

        <input
          className="form-control"
          type="email"
          placeholder="Email"
          ref={register({ required: true })}
          name="email"
        />

        <input
          className="form-control"
          type="number"
          placeholder="Age"
          max="99"
          min="1"
          ref={register({ required: true, max: 99, min: 1 })}
          name="age"
        /> */}

        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>

      {data && <p className="submit-result">{JSON.stringify(data)}</p>}
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
