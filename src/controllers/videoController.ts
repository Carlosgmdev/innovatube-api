import { Favorite, PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/auth";
import { Item, ToggleFavoriteForm, ToggleFavoriteResponse, Videos } from "../types/video";
import { Request, Response } from "express";

const prisma: PrismaClient = new PrismaClient()

export const getVideos = async (req: AuthRequest, res: Response): Promise<any> => {
  const { search, pageToken } = req.query
  try {
    const ytResult = await fetch(`https://youtube.googleapis.com/youtube/v3/search?q=${search}&pageToken=${pageToken}&type=video&part=snippet&key=${process.env.YOUTUBE_API_KEY}`);
    const ytJson: Videos = await ytResult.json();
    res.status(200).json(ytJson);
  } catch (error) {
    console.log(error)
    res.status(500).json({ errors: [{ message: 'No se pudieron obtener videos, por favor intente mas tarde.' }] })
  }
}

export const toggleFavorite = async (req: AuthRequest<{}, {}, ToggleFavoriteForm>, res: Response): Promise<any> => {
  const { videoId, } = req.body
  const { user } = req
  const favorite = await prisma.favorite.findFirst({ where: { userId: user!.id, videoId } })
  if (favorite) {
    await prisma.favorite.delete({ where: { id: favorite.id } })
    const result: ToggleFavoriteResponse = { action: 'remove', favorite: null }
    res.status(200).json(result)
  } else {
    const newFavorite: Favorite = await prisma.favorite.create({ data: { userId: user!.id, videoId } })
    const result: ToggleFavoriteResponse = { action: 'add', favorite: newFavorite }
    res.status(201).json(result)
  }
}

export const getFavorites = async (req: AuthRequest, res: Response): Promise<any> => {
  const { user } = req
  const favorites = await prisma.favorite.findMany({ where: { userId: user!.id } })
  const videos = await Promise.all(favorites.map(async favorite => await getVideo(favorite.videoId)))
  const result = videos.map(v => v!.items[0])
  res.status(200).json(result)
}

const getVideo = async (videoId: string): Promise<any> => {
  try {
    const ytResult = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`);
    const ytJson = await ytResult.json();
    return ytJson;
  } catch (error) {
    return null
  }
}