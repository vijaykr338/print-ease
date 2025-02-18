"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";
// import { useSession } from "next-auth/react";

const CompleteProfile = () => {
  const [name, setName] = useState<string>("");
  const [rollNo, setRollNo] = useState<string>("");
  const router = useRouter();
  // const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !rollNo) {
      setError("Both fields are required");
      return;
    }

    try {
      await axios.post("/api/set-profile", { name, rollNo });
      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <Typography variant="h5" gutterBottom className="text-center mb-6">
          Complete Your Profile
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <TextField
              label="Roll Number"
              variant="outlined"
              fullWidth
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: "100%", padding: "12px" }}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
