"use client";
import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// import plugins if you need
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

export default function PhotoGallery({ photos }) {
  const onInit = () => {
    console.log("lightGallery has been initialized");
  };

  return (
    <div>
      <LightGallery
        onInit={onInit}
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        elementClassNames="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3"
      >
        {photos.map((photo, index) => (
          <a key={index} data-src={photo.url}>
            <img
              src={photo.url}
              alt={`photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </a>
        ))}
      </LightGallery>
    </div>
  );
}
