import { ReferenceMap, create, error } from '@hatiolab/things-scene'
import { fetchBoard } from '@things-factory/board-base'

export const provider = new ReferenceMap(
  async (boardId, resolve, reject) => {
    try {
      const response = await fetchBoard(boardId)
      const board = response.board

      var model = JSON.parse(board.model)

      var scene

      try {
        scene = await provider.get(boardId)
        console.warn('Board fetched more than twice.', boardId)
      } catch (e) {
        scene = create({
          model,
          mode: 0,
          refProvider: provider
        })

        // s.app.baseUrl = undefined;
      }

      resolve(scene, {
        ...board,
        model
      })
    } catch (e) {
      error(e)
      reject(e)
    }
  },
  async (id, ref) => {
    ref.dispose()
  }
)
