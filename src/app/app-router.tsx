import { addBasePath } from "../utils/add-base-path";

// ...existing code...

function navigateTo(path: string | undefined) {
  if (typeof path !== "string") {
    throw new TypeError("Path must be a string");
  }

  const fullPath = addBasePath(path);
  // ...existing code...
}

// ...existing code...
