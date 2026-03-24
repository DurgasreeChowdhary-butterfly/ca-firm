import React from 'react';
import { Star, ExternalLink } from 'lucide-react';

// ── Static Google Reviews ──
// Replace these with your client's REAL Google reviews
// To get: Go to Google Maps → their business → copy review text + name
// Also replace GOOGLE_MAPS_URL with their actual Google Maps business link

const GOOGLE_MAPS_URL = 'https://g.page/r/YOUR_PLACE_ID/review'; // Replace with real URL
const OVERALL_RATING = 4.9;
const TOTAL_REVIEWS = 127;

const reviews = [
  {
    name: 'Rajesh Kumar',
    rating: 5,
    date: '2 weeks ago',
    text: 'Excellent service! CA Rajan helped me file my ITR and saved me significant tax through proper deductions. Very professional and prompt. Highly recommend!',
    avatar: 'R',
    verified: true,
  },
  {
    name: 'Sunita Patel',
    rating: 5,
    date: '1 month ago',
    text: 'Got our company registered and GST setup done here. The entire process was smooth and they guided us at every step. Best CA firm in Mumbai!',
    avatar: 'S',
    verified: true,
  },
  {
    name: 'Vikram Mehta',
    rating: 5,
    date: '1 month ago',
    text: 'CA Priya handled our tax planning and audit. Saved our firm over ₹3 lakhs in tax last year. They know their stuff and are always available on WhatsApp.',
    avatar: 'V',
    verified: true,
  },
  {
    name: 'Ananya Singh',
    rating: 4,
    date: '2 months ago',
    text: 'Very knowledgeable team. They explained all the GST compliance requirements for our startup in simple language. Would definitely recommend to other founders.',
    avatar: 'A',
    verified: true,
  },
  {
    name: 'Mohammed Irfan',
    rating: 5,
    date: '3 months ago',
    text: 'Switched from my previous CA last year and the difference is night and day. Timely filing, clear communication, and they actually explain what they\'re doing.',
    avatar: 'M',
    verified: true,
  },
  {
    name: 'Priya Nair',
    rating: 5,
    date: '3 months ago',
    text: 'The appointment booking system on their website made it so easy to schedule a consultation. Professional firm with great digital experience. 5 stars!',
    avatar: 'P',
    verified: true,
  },
];

function StarRating({ rating, size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${sizeClass} ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function GoogleReviews() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <img
              src="https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png"
              alt="Google"
              className="w-4 h-4"
              onError={e => e.target.style.display = 'none'}
            />
            <span className="text-blue-700 font-semibold text-sm">Google Reviews</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="text-5xl font-bold text-gray-900">{OVERALL_RATING}</span>
            <div>
              <StarRating rating={Math.round(OVERALL_RATING)} size="lg" />
              <p className="text-gray-500 text-sm mt-1">{TOTAL_REVIEWS} reviews on Google</p>
            </div>
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            See all reviews on Google <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-gray-400 text-xs">{review.date}</p>
                      {review.verified && (
                        <span className="text-green-600 text-xs">✓ Google</span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Google G icon */}
                <div className="w-6 h-6 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </div>

              <StarRating rating={review.rating} />
              <p className="text-gray-600 text-sm leading-relaxed mt-3 line-clamp-4">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Leave a review CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-3">Happy with our service? Share your experience!</p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-700 font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Write a Google Review
          </a>
        </div>
      </div>
    </section>
  );
}
