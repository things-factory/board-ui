export default function route(page) {
  switch (page) {
    case 'board-list':
      import('./pages/board-list-page')
      return page

    case 'play-list':
      import('./pages/play-list-page')
      return page

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
