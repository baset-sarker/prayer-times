// import React, { useState } from 'react';

// function NumberInputIncDec({ min = 0, max = Infinity, step = 1, initialValue = 0 , name ,targetId}) {
//   const [value, setValue] = useState(initialValue);
  
//   const handleIncrement = () => {
//     setValue((prevValue) => Math.min(max, prevValue + step));
//     // check if fieldId is defined
//     if (targetId) {
//       // get the element by id
//       const element = document.getElementById(targetId);
//       // set the value of the element
//       //element.value = value + step;
//       // element.value = incrementTime(fieldId, step);
//     }
//   };

//   const handleDecrement = () => {
//     setValue((prevValue) => Math.max(min, prevValue - step));
//   };

//   // const handleChange = (e) => {
//   //   const newValue = Number(e.target.value);
//   //   if (!isNaN(newValue)) {
//   //     setValue(Math.min(max, Math.max(min, newValue)));
//   //   }
//   // };

//   const handleChange = (e) => {
//     const newValue = parseInt(e.target.value, 10) || 0;
//     setNumber(newValue);
//     if (onChange) { // Call onChange if provided
//       onChange({ target: { name, value: newValue }}); // Simulate event
//     }
//   };

//   return (
//     <div className="input-group">
//       <button className="btn btn-outline-secondary" type="button" onClick={handleDecrement}>
//         -
//       </button>
//       <input
//         type="number"
//         className="form-control"
//         id="ds"
//         name={name}
//         value={value}
//         onChange={handleChange}
//         min={min}
//         max={max}
//         step={step}
//       />
//       <button className="btn btn-outline-secondary" type="button" onClick={handleIncrement}>
//         +
//       </button>
//     </div>
//   );
// }

// export { NumberInputIncDec };
// //export default NumberInputIncDec;



// import React, { useState } from 'react';

// function NumberInputIncDec({ min = 0, max = Infinity, step = 1, initialValue = 0, name, onChange }) {  // Add onChange prop
//   const [value, setValue] = useState(initialValue);

//   const handleIncrement = () => {
//     const newValue = Math.min(max, value + step); // Calculate new value
//     setValue(newValue);
//     if (onChange) {
//       onChange({ target: { name, value: newValue } }); // Call parent's onChange
//     }
//   };

//   const handleDecrement = () => {
//     const newValue = Math.max(min, value - step); // Calculate new value
//     setValue(newValue);
//     if (onChange) {
//       onChange({ target: { name, value: newValue } }); // Call parent's onChange
//     }
//   };

//   const handleChange = (e) => {
//     const newValue = parseInt(e.target.value, 10) || 0; // Parse to int, default to 0 if NaN
//     setValue(newValue);
//     if (onChange) {
//       onChange({ target: { name, value: newValue } }); // Call parent's onChange
//     }
//   };

//   return (
//     <div className="input-group">
//       <button className="btn btn-outline-secondary" type="button" onClick={handleDecrement}>
//         -
//       </button>
//       <input
//         type="number"
//         className="form-control"
//         id="ds"  // Remove or make unique - IDs should be unique
//         name={name}
//         value={value}
//         onChange={handleChange}
//         min={min}
//         max={max}
//         step={step}
//       />
//       <button className="btn btn-outline-secondary" type="button" onClick={handleIncrement}>
//         +
//       </button>
//     </div>
//   );
// }

// export { NumberInputIncDec };





// NumberInputIncDec.js (Stateless Functional Component)
import React from 'react';

function NumberInputIncDec({ min = 0, max = Infinity, step = 1, value, name, onChange }) { // value prop
  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10) || 0;
    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  return (
    <div className="input-group">
      <button className="btn btn-outline-secondary" type="button" onClick={handleDecrement}>
        -
      </button>
      <input
        type="number"
        className="form-control"
        name={name}
        value={value} // Use the value prop here
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
      />
      <button className="btn btn-outline-secondary" type="button" onClick={handleIncrement}>
        +
      </button>
    </div>
  );
}

export { NumberInputIncDec };