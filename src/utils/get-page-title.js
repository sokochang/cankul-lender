import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Back End System Manajemen CANKUL'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
