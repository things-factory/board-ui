import gql from 'graphql-tag'
import { client } from '@things-factory/shell'
import { ReferenceMap, create, error } from '@hatiolab/things-scene'

export const provider = new ReferenceMap(
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

      var scene = create({
        model,
        mode: 0,
        refProvider: provider
      })

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
