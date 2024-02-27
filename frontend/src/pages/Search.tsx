import { useQuery } from "react-query";
import { useSearchContext } from "../context/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import HotelFacilitiesFilter from "../components/FacilitiesFiltes";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();

  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedHotelFacilities, setSelectedHotelFacilities] = useState<
    string[]
  >([]);
  const [maxSelectedPrice, setMaxSelectedPrice] = useState<
    number | undefined
  >();
  const [sortOption, setSortOption] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toString(),
    checkOut: search.checkOut.toString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedHotelFacilities,
    maxPrice: maxSelectedPrice?.toString(),
    sortOption,
  };

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelType = event.target.value;

    setSelectedHotelTypes((prevHotelTypes) =>
      event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((type) => type !== hotelType)
    );
  };

  const handleHotelFacilities = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const facility = event.target.value;

    setSelectedHotelFacilities((prevHotelFacilities) =>
      event.target.checked
        ? [...prevHotelFacilities, facility]
        : prevHotelFacilities.filter((facilities) => facilities !== facility)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter By:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selectedHotelTypes={selectedHotelTypes}
            onChange={handleHotelTypeChange}
          />
          <HotelFacilitiesFilter
            selectedFacilities={selectedHotelFacilities}
            onChange={handleHotelFacilities}
          />
          <PriceFilter
            selectedPrice={maxSelectedPrice}
            onChange={(value?: number) => setMaxSelectedPrice(value)}
          />
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
              {hotelData?.pagination.total} Hotels found
              {search.destination ? ` in ${search.destination}` : ""}
            </span>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="p-2 border rounded-md focus:outline-none"
            >
              <option value="">Sort By</option>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">
                Price Per Night (low to high)
              </option>
              <option value="pricePerNightDesc">
                Price Per Night (high to low)
              </option>
            </select>
          </div>
          {hotelData?.data.map((hotel) => (
            <SearchResultCard hotel={hotel} key={hotel._id} />
          ))}
          <div>
            <Pagination
              page={hotelData?.pagination.page || 1}
              pages={hotelData?.pagination.pages || 1}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
