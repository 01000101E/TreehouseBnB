import { useModal } from '../../context/Modal';

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return <button onClick={onClick}>{buttonText}</button>;
}
// Let's say you want to render a popup modal text of "Hello World!" when a button with the text of Greeting is clicked. You can use the OpenModalButton to create a component that renders a button to trigger this modal.

// const Greeting = () => {
//     return (
//       <OpenModalButton
//         buttonText="Greeting"
//         modalComponent={<h2>Hello World!</h2>}
//       />
//     );
//   };

// Let's say you want to print "Greeting initiated" in the console logs whenever the Greeting button is clicked. You could add the following callback function as the onButtonClick prop to the OpenModalButton component:

// const Greeting = () => {
//   return (
//     <OpenModalButton
//       buttonText="Greeting"
//       modalComponent={<h2>Hello World!</h2>}
//       onButtonClick={() => console.log("Greeting initiated")}
//     />
//   );
// };

// Now, let's say you wanted to print "Greeting completed" in the console logs whenever the user closes the "Hello World!" modal. You could add the following callback function as the onModalClose prop to the OpenModalButton component:

// const Greeting = () => {
//   return (
//     <OpenModalButton
//       buttonText="Greeting"
//       modalComponent={<h2>Hello World!</h2>}
//       onButtonClick={() => console.log("Greeting initiated")}
//       onModalClose={() => console.log("Greeting completed")}
//     />
//   );
// };

export default OpenModalButton;