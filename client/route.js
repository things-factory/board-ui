export default function route(page) {
  switch (page) {
    case 'board-viewer':
      import('./pages/board-viewer-page')
      return page

    case 'board-player':
      import('./pages/board-player-page')
      return page

    case 'board-modeller':
      import('./pages/board-modeller-page')
      return page
  }
}
