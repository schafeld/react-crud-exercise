import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit as fbLimit, where, QueryConstraint } from "firebase/firestore";
import { db } from "../firebase";

// Adjust fields as per your Firestore "listings" schema
type Offer = {
  id: string;
  title: string;
  description?: string;
  price: number;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  imgUrls?: string[];
  isNew?: boolean;
  [key: string]: any;
};

type RecentOffersProps = {
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showPrice?: boolean;
  showDate?: boolean;
  limit?: number;
  isNew?: boolean | null;
};

const RecentOffers: React.FC<RecentOffersProps> = ({
  showImage = true,
  showTitle = true,
  showDescription = true,
  showPrice = true,
  showDate = true,
  limit = 5,
  isNew = undefined,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const listingsRef = collection(db, "listings");
        let q;

        // Only filter by isNew if it is strictly true or false
        if (typeof isNew === "boolean") {
          // Only orderBy createdAt, do NOT orderBy isNew (not needed and can break filtering)
          q = query(
            listingsRef,
            where("isNew", "==", isNew),
            orderBy("createdAt", "desc"),
            fbLimit(limit)
          );
        } else {
          q = query(
            listingsRef,
            orderBy("createdAt", "desc"),
            fbLimit(limit)
          );
        }

        const querySnap = await getDocs(q);
        const data: Offer[] = [];
        querySnap.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          } as Offer);
        });
        setOffers(data);
      } catch (error) {
        setOffers([]);
      }
      setLoading(false);
    };
    fetchOffers();
  }, [limit, isNew]);

  if (loading) {
    return <div className="text-gray-600 mt-4">Loading recent offers...</div>;
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto mt-6">
      {offers.map((offer) => (
        <Link
          to={`/listing/${offer.id}`}
          key={offer.id}
          className="bg-white rounded shadow p-4 flex items-center gap-4 hover:bg-gray-50 transition"
        >
          {showImage && offer.imgUrls && offer.imgUrls.length > 0 && (
            <img
              src={offer.imgUrls[0]}
              alt={offer.title}
              className="w-16 h-16 object-cover rounded"
            />
          )}
          <div className="flex-1">
            {showTitle && (
              <h2 className="font-semibold text-lg text-left">{offer.title}</h2>
            )}
            {showDescription && offer.description && (
              <p className="text-gray-600 text-sm">{offer.description}</p>
            )}
            <div className="flex gap-4 mt-1 text-sm text-gray-500">
              {showPrice && <span>Price: ${offer.price}</span>}
              {showDate && offer.createdAt && (
                <span>
                  {new Date(offer.createdAt.seconds * 1000).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentOffers;