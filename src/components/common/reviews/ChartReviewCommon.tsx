"use client";

import { API_REVIEW_HEALTH } from "@/api-services/constant-api";
import { ReviewHealthIndex } from "@/models";
import useSWR from "swr";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Pie, PolarArea } from "react-chartjs-2";
import { useMemo } from "react";
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export interface IChartReviewCommonProps {
  healthFacilityId: string | undefined;
}

export default function ChartReviewCommon({
  healthFacilityId,
}: IChartReviewCommonProps) {
  const { data: resReviews, mutate: matateReview } = useSWR<ReviewHealthIndex>(
    `${API_REVIEW_HEALTH}/index?healthFacilityId=${healthFacilityId}`
  );
  const arrayStar = useMemo(() => {
    return [
      resReviews?.reviewIndex.star.star5,
      resReviews?.reviewIndex.star.star4,
      resReviews?.reviewIndex.star.star3,
      resReviews?.reviewIndex.star.star2,
      resReviews?.reviewIndex.star.star1,
    ];
  }, [resReviews]);

  const data = {
    labels: ["5 sao", "4 sao", "3 sao", "2 sao", "1 sao"],
    datasets: [
      {
        label: "Đánh giá",
        data: arrayStar,
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      <Pie data={data} height={300} options={options}></Pie>
    </div>
  );
}
