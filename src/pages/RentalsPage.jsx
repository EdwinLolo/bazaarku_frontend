import React from "react";
import RentalProductCard from '../components/RentalProductCard';
import { getBaseUrl } from "../models/utils";
import TempImage from '../assets/Audio Control Panel.png';

function RentalsPage() {
    const stageAudioVisualEquipment = [
        {
            imageUrl: TempImage,
            title: "Sound System 1",
            price: "Rp. 1.000.000,00",
            location: "Tangerang",
            id: "sound-system-1",
            rental_category: "audio",
        },
        {
            imageUrl: TempImage,
            title: "Lighting Rig A",
            price: "Rp. 750.000,00",
            location: "Jakarta",
            id: "lighting-rig-a",
            rental_category: "lighting",
        },
        {
            imageUrl: TempImage,
            title: "Projector HD",
            price: "Rp. 1.200.000,00",
            location: "Bekasi",
            id: "projector-hd",
            rental_category: "visual",
        },
        {
            imageUrl: TempImage,
            title: "Fog Machine Pro",
            price: "Rp. 300.000,00",
            location: "Depok",
            id: "fog-machine-pro",
            rental_category: "effects",
        },
        {
            imageUrl: TempImage,
            title: "Portable Stage 2x2m",
            price: "Rp. 900.000,00",
            location: "Tangerang",
            id: "portable-stage-2x2m",
            rental_category: "stage",
        },
    ];

    // Static data for Decor And Furniture
    const decorAndFurniture = [
        {
            imageUrl: TempImage,
            title: "Elegant Chair Set",
            price: "Rp. 500.000,00",
            location: "Bandung",
            id: "elegant-chair-set",
            rental_category: "furniture",
            className: "col-span-1 sm:col-span-2 lg:col-span-4",
        },
        {
            imageUrl: TempImage,
            title: "Floral Archway",
            price: "Rp. 600.000,00",
            location: "Bogor",
            id: "floral-archway",
            rental_category: "decor",
            className: "col-span-1 sm:col-span-1 lg:col-span-2",
        },
        {
            imageUrl: TempImage,
            title: "LED Uplights (Set of 4)",
            price: "Rp. 400.000,00",
            location: "Surabaya",
            id: "led-uplights",
            rental_category: "lighting",
            className: "col-span-1 sm:col-span-1 lg:col-span-2",
        },
        {
            imageUrl: TempImage,
            title: "Red Carpet Runner",
            price: "Rp. 250.000,00",
            location: "Yogyakarta",
            id: "red-carpet-runner",
            rental_category: "decor",
            className: "col-span-1 sm:col-span-1 lg:col-span-2",
        },
        {
            imageUrl: TempImage,
            title: "Vintage Sofa",
            price: "Rp. 700.000,00",
            location: "Semarang",
            id: "vintage-sofa",
            rental_category: "furniture",
            className: "col-span-1 sm:col-span-1 lg:col-span-2",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <div className="px-4 md:px-12 my-5">
                <h1 className="text-4xl text-primary font-bold mb-4">Tool Rentals</h1>
                <img
                    src={TempImage}
                    alt="Audio Control Panel"
                    className="w-full h-80 md:h-120 object-cover rounded-lg mb-6"
                />
            </div>

            <section className="mb-16 px-4 md:px-12">
                <h1 className="text-4xl text-primary font-bold mb-4">Stage and Audio Visual Equipment</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                    {stageAudioVisualEquipment.map((product) => (
                        <RentalProductCard
                            key={product.id}
                            imageUrl={product.imageUrl}
                            title={product.title}
                            price={product.price}
                            location={product.location}
                            id={product.id}
                            rental_category={product.rental_category}
                        />
                    ))}
                </div>
            </section>

            <section className="mb-16 px-4 md:px-12">
                <h1 className="text-4xl text-primary font-bold mb-4">Decor And Furniture</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-8 auto-rows-fr">
                    {decorAndFurniture.map((product) => (
                        <RentalProductCard
                            key={product.id}
                            imageUrl={product.imageUrl}
                            title={product.title}
                            price={product.price}
                            location={product.location}
                            id={product.id}
                            rental_category={product.rental_category}
                            className={product.className}
                        />
                    ))}
                </div>
            </section>
        </div >
    )
}

export default RentalsPage;