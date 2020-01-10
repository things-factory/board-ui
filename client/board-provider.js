import gql from 'graphql-tag'
import { client } from '@things-factory/shell'
import { ReferenceMap, create, error } from '@hatiolab/things-scene'

export function createBoardProvider() {
  var _provider = new ReferenceMap(
    async (boardId, resolve, reject) => {
      try {
        const response = await client.query({
          query: gql`
            query FetchBoardById($id: String!) {
              board(id: $id) {
                model
              }
            }
          `,
          variables: { id: boardId }
        })

        const board = response.data.board

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

  return _provider
}

export const provider = createBoardProvider()
