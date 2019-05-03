import route from './src/route'
import bootstrap from './src/bootstrap'

export default {
  route,
  routes: [
    {
      tagname: 'board-viewer-page',
      page: 'board-viewer'
    },
    {
      tagname: 'board-player-page',
      page: 'board-player'
    },
    {
      tagname: 'board-modeller-page',
      page: 'board-modeller'
    }
  ],
  bootstrap
}
