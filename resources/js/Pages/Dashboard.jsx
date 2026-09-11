import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Sample motivational quotes – you can add more
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Your limitation—it’s only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
];

// Local images for slideshow (place your images in public/storage/slideshow/)
// For demo, we'll use placeholder images from placekitten or unsplash, but you should replace with local paths.
// Example local images: '/storage/slideshow/1.jpg', '/storage/slideshow/2.jpg', etc.
const defaultImages = [
    '/storage/images/1.jfif',
    '/storage/images/2.jfif',
    '/storage/images/3.jpg',
    '/storage/images/6.jpg',
    '/storage/images/5.jfif',
];

export default function Dashboard({ stats }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [slideIndex, setSlideIndex] = useState(0);
    const [images] = useState(defaultImages);

    // Update live clock every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Rotate quote every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Auto-rotate slideshow every 5 seconds
    useEffect(() => {
        if (images.length === 0) return;
        const interval = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images]);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const currentQuote = quotes[quoteIndex];

    return (
        <AuthenticatedLayout

        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="text-sm uppercase tracking-wide opacity-90">Available Balance</div>
                            <div className="text-4xl font-bold mt-2">{stats.employeesWithBalance}</div>
                            <div className="text-xs mt-2 opacity-80">Employees with positive CTO</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="text-sm uppercase tracking-wide opacity-90">Total Hours Earned</div>
                            <div className="text-4xl font-bold mt-2">{stats.totalHoursEarned}</div>
                            <div className="text-xs mt-2 opacity-80">All overtime credits</div>
                        </div>
                        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="text-sm uppercase tracking-wide opacity-90">Total Hours Used</div>
                            <div className="text-4xl font-bold mt-2">{stats.totalHoursUsed}</div>
                            <div className="text-xs mt-2 opacity-80">All time‑off requests</div>
                        </div>
                    </div>

                    {/* Widgets Row: Clock, Quotes, Slideshow */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Clock & Date Widget */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gray-800 text-white p-4">
                                <h3 className="font-semibold">📅 Live System Time</h3>
                            </div>
                            <div className="p-6 text-center">
                                <div className="text-5xl font-mono font-bold text-gray-800">{formatTime(currentTime)}</div>
                                <div className="text-lg text-gray-600 mt-3">{formatDate(currentTime)}</div>
                                <div className="mt-4 text-sm text-gray-500">Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
                            </div>
                        </div>

                        {/* Quotes Widget */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                            <div className="bg-indigo-600 text-white p-4">
                                <h3 className="font-semibold">✨ Daily Inspiration</h3>
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-center">
                                <p className="text-xl italic text-gray-700 leading-relaxed">"{currentQuote.text}"</p>
                                <p className="text-right text-gray-500 mt-4">— {currentQuote.author}</p>
                            </div>
                        </div>

                        {/* Slideshow Widget */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-purple-600 text-white p-4">
                                <h3 className="font-semibold">📸 My Moments</h3>
                            </div>
                            <div className="relative h-64 bg-gray-100">
                                {images.length > 0 ? (
                                    <img
                                        src={images[slideIndex]}
                                        alt={`Slide ${slideIndex + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        No images found. Add images to <code className="text-sm">public/storage/slideshow/</code>
                                    </div>
                                )}
                                {/* Optional navigation dots */}
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSlideIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                idx === slideIndex ? 'bg-white w-4' : 'bg-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Optional: extra content like recent activities? Not needed now */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
