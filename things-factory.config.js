import route from './client/route'
import bootstrap from './client/bootstrap'

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
