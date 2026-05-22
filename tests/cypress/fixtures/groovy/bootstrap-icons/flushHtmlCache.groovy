import net.sf.ehcache.CacheManager
import org.jahia.services.SpringContextSingleton

try {
    def provider = SpringContextSingleton.getInstance().getContext().getBean("moduleCacheProvider")
    provider.getCache()?.removeAll()
    provider.getDependenciesCache()?.removeAll()
} catch (Exception ignored) {}

for (def cm : CacheManager.ALL_CACHE_MANAGERS) {
    for (def name : cm.cacheNames) {
        cm.getEhcache(name)?.removeAll()
    }
}
