import { useState, useCallback } from 'react';
import { tripService } from '../services/trip.service.js';
import toast from 'react-hot-toast';

export const useTrip = () => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateTrip = useCallback(async (data) => {
    setGenerating(true);
    try {
      const res = await tripService.generate(data);
      toast.success('Itinerary generated! ✈️');
      return res.data.data.itinerary;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
      throw err;
    } finally {
      setGenerating(false);
    }
  }, []);

  const saveTrip = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await tripService.save(data);
      toast.success('Trip saved!');
      return res.data.data.trip;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTrip = useCallback(async (id) => {
    try {
      await tripService.delete(id);
      toast.success('Trip deleted');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
      return false;
    }
  }, []);

  const shareTrip = useCallback(async (id) => {
    try {
      const res = await tripService.share(id);
      const { shareUrl } = res.data.data;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
      return shareUrl;
    } catch (err) {
      toast.error('Failed to generate share link');
    }
  }, []);

  return { loading, generating, generateTrip, saveTrip, deleteTrip, shareTrip };
};
