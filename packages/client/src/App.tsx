import Chatbot from './components/chat/Chatbot';
import Reviews from './components/reviews/Reviews';
import ReviewList from './components/reviews1/ReviewList';
import ReviewList1 from './components/reviews1/ReviewList1';

function App() {
   return (
      <div className="p-4 h-screen w-full">
         <Chatbot />

         {/* <Reviews />
          */}
         {/* <ReviewList1 productId={2} /> */}
      </div>
   );
}

export default App;
