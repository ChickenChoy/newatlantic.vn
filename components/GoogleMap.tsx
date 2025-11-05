interface GoogleMapProps {
  address: string;
  lat?: number;
  lng?: number;
  height?: string;
  className?: string;
}

export default function GoogleMap({
  address,
  lat = 10.7296,
  lng = 106.7278,
  height = '300px',
  className = '',
}: GoogleMapProps) {
  // Create Google Maps link
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <a 
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#5f7ab8] ${className}`}
      style={{ height, minHeight: '200px' }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
        {/* Map Icon */}
        <div className="w-16 h-16 mb-4 bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        {/* Address */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-gray-700 mb-2">
            <svg className="w-4 h-4 text-[#5f7ab8]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold">Xem trên Google Maps</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{address}</p>
        </div>
        
        {/* Arrow Icon */}
        <div className="absolute top-4 right-4">
          <svg className="w-5 h-5 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </a>
  );
}

