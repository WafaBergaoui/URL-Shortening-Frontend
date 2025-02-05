"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import UrlForm from "@/components/forms/UrlForm";

export default function Home() {
  return (
    <Provider store={store}>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <UrlForm />
      </main>
    </Provider>
  );
}
