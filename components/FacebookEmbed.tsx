"use client";

import { useEffect } from "react";

export default function FacebookPageFeed() {
  useEffect(() => {
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v23.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    } else if (window.FB?.XFBML) {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <>
      <div id="fb-root"></div>

      <div
        className="fb-page"
        data-href="https://www.facebook.com/profile.php?id=100086123649589"
        data-tabs="timeline"
        data-width="500"
        data-height="700"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote cite="https://www.facebook.com/profile.php?id=100086123649589" className="fb-xfbml-parse-ignore">
          <a href="https://www.facebook.com/profile.php?id=100086123649589">Facebook</a>
        </blockquote>
      </div>
    </>
  );
}
