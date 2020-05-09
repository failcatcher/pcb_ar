import details from '@/utils/details'
import { MODELS_DIR, PATTERNS_DIR } from '@/utils/constants'

export function getBoard(id) {
  return details.find(i => i.id == id)
}

export function getModelPath(boardId, levelFile) {
  return {
    model: `${MODELS_DIR}/${boardId}/${levelFile}.obj`,
    material: `${MODELS_DIR}/${boardId}/${levelFile}.mtl`
  }
}

export function getPatternPath(boardId) {
  return `${PATTERNS_DIR}/model${boardId}.patt`
}
