import { dataState } from '@/utils/type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the async thunk for uploading a file
export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async (file: File, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result; // Return the result if the upload succeeds
    } catch (error) {
      return "rejectWithValue(error.message)"; // Return error message on failure
    }
  }
);

// Create the slice for managing data state
const dataSlice = createSlice({
  name: 'data',
  initialState: {
    preview: null,
    image_files: null,
    loading: false,
    ecg_1dsignal: null,
    ecg_final: null,
    image_data: null,
    result: null,
    predict: null,
    gray_image: null,
    lead: null,
    lead_13: null,
    prepossed_lead: null,
    prepossed_lead_13: null,
    contour_lead: null,
  } as dataState, // Type the initial state
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setImageData(state, action: PayloadAction<string | null>) {
      state.image_data = action.payload;
    },
    setResult(state, action: PayloadAction<string | null>) {
      state.result = action.payload;
    },
    setPredict(state, action: PayloadAction<string | null>) {
      state.predict = action.payload;
    },
    setImageFiles(state, action: PayloadAction<string | null>) {
      state.image_files = action.payload;
    },
    set1DSignal(state, action: PayloadAction<string | null>) {
      state.ecg_1dsignal = action.payload;
    },
    setFinal(state, action: PayloadAction<string | null>) {
      state.ecg_final = action.payload;
    },
    setGrayImage(state, action: PayloadAction<string | null>) {
      state.gray_image = action.payload;
    },
    setLead(state, action: PayloadAction<string | null>) {
      state.lead = action.payload;
    },
    setPreProcessLead(state, action: PayloadAction<string | null>) {
      state.prepossed_lead = action.payload;
    },
    setContourLead(state, action: PayloadAction<string | null>) {
      state.contour_lead = action.payload;
    },
    setPreview(state, action: PayloadAction<string | null>) {
      state.preview = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true; // Set loading to true when the API request is pending
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when the API request is fulfilled
        const payload = action.payload;
        state.result = payload.result;
        state.predict = payload.predict;
        state.image_files = payload.image_files;
        state.gray_image = payload.image_files?.[0] || null; // Safely access
        state.lead = payload.image_files?.[1] || null;
        state.lead_13 = payload.image_files?.[2] || null;
        state.prepossed_lead = payload.image_files?.[3] || null;
        state.prepossed_lead_13 = payload.image_files?.[4] || null;
        state.ecg_1dsignal = payload.ecg_1dsignal || null;
        state.ecg_final = payload.ecg_final || null;
        state.contour_lead = payload.image_files?.[5] || null;
        // console.log(state.ecg_1dsignal)
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false; // Set loading to false if the request fails
        // Optionally, store the error message in the state
        console.error('Upload failed:', action.payload);
        // Handle error here (action.error.message contains the error message)
      });
  },
});

// Export actions
export const {
  setLoading,
  setImageData,
  setResult,
  set1DSignal,
  setFinal,
  setImageFiles,
  setPredict,
  setGrayImage,
  setLead,
  setPreProcessLead,
  setContourLead,
  setPreview,
} = dataSlice.actions;

// Export the reducer
export default dataSlice.reducer;
