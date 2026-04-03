import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';

type Review = {
   id: number;
   author: string;
   rating: number;
   content: string;
   createdAt: string;
   productId: number;
};

type ReviewResponse = {
   summary: string;
   reviews: Review[];
};
const Reviews = () => {
   const [reviews, setReviews] = useState<ReviewResponse | null>(null);
   const [isLoading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [selectedId, setSelectedId] = useState<number>(1);
   // const id = 1;

   useEffect(() => {
      const fetchReviews = async () => {
         try {
            setLoading(true);
            const response = await axios.get<ReviewResponse>(
               `/api/products/${selectedId}/reviews`
            );
            setReviews(response.data);

            console.log(response.data);
         } catch (err) {
            setLoading(false);
            setError((err as Error).message);
         } finally {
            setLoading(false);
         }
      };
      fetchReviews();
   }, [selectedId]);

   const onIdselected = (id: string) => {
      setSelectedId(parseInt(id));
   };

   if (isLoading) return <p>Loading...</p>;
   if (error) return <p>An unexpected error occurred: {error}</p>;
   if (!reviews) return <p>No reviews found.</p>;

   return (
      <div className="flex flex-col gap-2">
         <IdSelector onIdselected={onIdselected} />
         <h2 className="text-2xl">This is what i fectch from backend:</h2>
         {reviews.summary && (
            <p className="bg-amber-100 max-w-2xl">{reviews.summary}</p>
         )}
         {reviews.reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
         ))}
      </div>
   );
};

export default Reviews;

const IdSelector = ({
   onIdselected,
}: {
   onIdselected: (id: string) => void;
}) => {
   return (
      <Select onValueChange={onIdselected}>
         <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a product id" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
         </SelectContent>
      </Select>
   );
};

const ReviewCard = ({ review }: { review: Review }) => {
   return (
      <div className="card">
         <Card className="max-w-md">
            <CardHeader>
               <CardTitle>{review.author}</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-gray-700 mb-2">{review.content}</p>
               <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
               </p>
               <p>{review.rating}</p>
            </CardContent>
         </Card>
      </div>
   );
};
