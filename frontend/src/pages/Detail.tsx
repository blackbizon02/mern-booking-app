import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useQuery } from "react-query";
import { AiFillStar } from "react-icons/ai";
import GuestInfo from "../forms/guestInfoForm/GuestInfo";

const Detail = () => {
  const { id: hotelId } = useParams();

  const { data: hotelData } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  if (!hotelData) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: hotelData.starRating }).map(() => (
            <AiFillStar className="fill-yellow-400" key={Math.random()} />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotelData.name}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotelData.imageUrls.map((url) => (
          <div className="h-[300px]" key={url}>
            <img
              src={url}
              alt={hotelData.name}
              className="rounded-md h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotelData.facilities.map((facility) => (
          <div
            className="border border-slate-300 rounded-sm p-3"
            key={facility}
          >
            {facility}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{hotelData.description}</div>
        <div className="h-fit">
          <GuestInfo
            hotelId={hotelData._id}
            pricePerNight={hotelData.pricePerNight}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
