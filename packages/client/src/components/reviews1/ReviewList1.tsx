import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi';
import { useState } from 'react';

type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

type SummarizeResponse = {
   summary: string;
};

export type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

const useReviews = (productId: number) => {
   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   return useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: fetchReviews,
      staleTime: 1 * 60 * 1000, //1m
   });
};

const useGenerateSummary = (productId: number) => {
   const summarizeReviews = async () => {
      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return data;
   };

   return useMutation<SummarizeResponse, Error, number>({
      mutationFn: summarizeReviews,
   });
};

const ReviewList1 = ({ productId }: { productId: number }) => {
   const reviewsQuery = useReviews(productId);
   const summaryMutation = useGenerateSummary(productId);

   if (reviewsQuery.isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }
   if (reviewsQuery.isError) {
      return (
         <p className="text-red-500">Could not fetch reviews. Try again.</p>
      );
   }

   if (!reviewsQuery.data?.reviews.length) return null;

   const currentSummary =
      reviewsQuery.data.summary || summaryMutation.data?.summary;
   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     // notion:
                     onClick={() => summaryMutation.mutate(productId)}
                     disabled={summaryMutation.isPending}
                     className="cursor-pointer"
                  >
                     <HiSparkles />
                     Summarize
                  </Button>

                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}

                  {summaryMutation.isError && (
                     <p className="text-red-500">
                        Could not summarize reviews. Try again.
                     </p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsQuery.data?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating value={review.rating} />
                  </div>
                  <p className="py-2">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};
export default ReviewList1;

import React from 'react';

const ReviewSkeleton = () => {
   return (
      <div>
         <Skeleton width={150} />
         <Skeleton width={100} />
         <Skeleton count={2} />
      </div>
   );
};
