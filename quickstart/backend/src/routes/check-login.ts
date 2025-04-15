import type { Request, Response } from 'express'
import { getAccessToken } from '../utils/access-token'

export const checkLogin = async (req: Request, res: Response) => {
  try {
    const token = getAccessToken(req)

    res.json({ isSignedIn: true })
    res.end()
    return
  } catch {
    res.json({ isSignedIn: false })
    res.end()
  }
}
