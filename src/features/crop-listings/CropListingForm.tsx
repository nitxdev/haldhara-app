import { useState, type FormEvent } from "react";
import "./CropListingForm.css";

type CropListingFormProps = {
  onCancel?: () => void;
  onSubmitListing?: (listing: {
    cropName: string;
    quantityKg: number;
    expectedPricePerKg: number;
    location: string;
    description: string;
    imageUrl?: string;
  }) => void | Promise<void>;
};

export default function CropListingForm({
  onCancel,
  onSubmitListing,
}: CropListingFormProps) {
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function handlePhotoChange(file?: File) {
    setMessage("");
    setPhotoFile(null);
    setPhotoPreview("");

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setMessage("JPG, PNG ya WebP photo select karo.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Photo ka size 5 MB se kam hona chahiye.");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const quantityKg = Number(quantity);
    const expectedPricePerKg = Number(price);

    if (!Number.isFinite(quantityKg) || quantityKg <= 0 ||
        !Number.isFinite(expectedPricePerKg) || expectedPricePerKg <= 0) {
      setMessage("Quantity aur price zero se zyada hone chahiye.");
      return;
    }

    setSubmitting(true);

    try {
      const listing = {
        cropName,
        quantityKg,
        expectedPricePerKg,
        location,
        description,
      };

      let imageUrl = "";

      if (photoFile) {
        const token = localStorage.getItem("haldhara_token");
        if (!token) {
          throw new Error("Photo upload karne ke liye pehle login karo.");
        }

        const photoData = new FormData();
        photoData.append("photo", photoFile);

        const uploadResponse = await fetch(
          "http://localhost:5001/api/crops/photo",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: photoData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || "Photo upload fail hua.");
        }

        imageUrl = uploadResult.data.imageUrl;
      }

      if (onSubmitListing) {
        await onSubmitListing({ ...listing, imageUrl });
      } else {
        const token = localStorage.getItem("haldhara_token");
        if (!token) {
          throw new Error("Crop listing ke liye pehle login karo.");
        }

        const response = await fetch("http://localhost:5001/api/crops", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...listing, imageUrl }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Crop listing save nahi hui.");
        }
      }

      setMessage("Crop listing successfully save ho gayi!");
      setCropName("");
      setQuantity("");
      setPrice("");
      setLocation("");
      setDescription("");
      setPhotoFile(null);
      setPhotoPreview("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Kuch galat hua. Dobara try karo."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="crop-form-page">
      <div className="crop-form-heading">
        <span className="crop-form-eyebrow">HALDHARA MARKETPLACE</span>
        <h1>Sell Your Crop</h1>
        <p>Apni fasal ki details bharo aur buyers tak pahucho.</p>
      </div>

      <form className="crop-listing-form" onSubmit={handleSubmit}>
        <label>
          Crop name *
          <select required value={cropName} onChange={(e) => setCropName(e.target.value)}>
            <option value="">Select your crop</option>
            <option>Ginger</option>
            <option>Potato</option>
            <option>Pineapple</option>
            <option>Orange</option>
            <option>Kiwi</option>
            <option>Turmeric</option>
            <option>Rice</option>
            <option>Other</option>
          </select>
        </label>

        <div className="crop-form-row">
          <label>
            Quantity (kg) *
            <input required type="number" min="0.01" step="any"
              value={quantity} onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 250" />
          </label>
          <label>
            Expected price (₹/kg) *
            <input required type="number" min="0.01" step="0.01"
              value={price} onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 85" />
          </label>
        </div>

        <label>
          Village / District *
          <input required value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Ziro, Lower Subansiri" />
        </label>

        <label>
          Crop photo (JPG, PNG or WebP, max 5 MB)
          <input type="file" accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handlePhotoChange(e.target.files?.[0])} />
          {photoPreview && (
            <img src={photoPreview} alt="Selected crop preview"
              style={{ width: "100%", maxHeight: 240, objectFit: "contain", borderRadius: 12 }} />
          )}
        </label>

        <label>
          Additional details
          <textarea rows={4} value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Harvest date, crop quality, pickup details..." />
        </label>

        {message && <p className="crop-form-message" role="status">{message}</p>}

        <div className="crop-form-actions">
          {onCancel && (
            <button type="button" className="crop-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button className="crop-submit" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "List My Crop"}
          </button>
        </div>

        <p className="crop-form-note">
          Photo upload aur listing save karne ke liye backend server running hona chahiye.
        </p>
      </form>
    </section>
  );
}
