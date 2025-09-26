import AppIntents
import ActivityKit

struct FizlAttributes: ActivityAttributes {
    public typealias FizlStatus = ContentState
    
    public struct ContentState: Codable, Hashable {
        var startTime: Date
        var endTime: Date
        var title: String
        var headline: String
        var widgetUrl: String
        var isPaused: Bool
    }
}

@main
struct EntryExtension: AppIntentsExtension {
}

struct myExtension: AppIntent {
    static var title: LocalizedStringResource { "my-extension" }
    
    func perform() async throws -> some IntentResult {
        print("perform()")
        try await pauseActivity()
        return .result()
    }


    func pauseActivity() async throws -> Bool {
        print("pauseActivity()")

            if #available(iOS 16.2, *) {
            let prevState = Activity<FizlAttributes>.activities.first?.content.state
            
            let contentState = FizlAttributes.ContentState(startTime: prevState!.startTime, endTime: prevState?.endTime ?? .now, title: prevState!.title, headline: prevState!.headline, widgetUrl: prevState?.widgetUrl ?? "https://example.com", isPaused: true)
            let activityContent = ActivityContent(state: contentState, staleDate: nil)
            
            for activity in Activity<FizlAttributes>.activities {
                await activity.update(activityContent)
            }


            return true
        }
        return false
    }

    func resumeActivity() async throws -> some IntentResult {
        print("resumeActivity()")

        if #available(iOS 16.2, *) {
            let prevState = Activity<FizlAttributes>.activities.first?.content.state
            let contentState = FizlAttributes.ContentState(startTime: prevState?.startTime ?? .now, endTime: prevState?.endTime ?? .now, title: prevState?.title ?? "title", headline: prevState?.headline ?? "headline", widgetUrl: prevState?.widgetUrl ?? "https://example.com", isPaused: false)

            let activityContent = ActivityContent(state: contentState, staleDate: nil)

            for activity in Activity<FizlAttributes>.activities {
                await activity.update(activityContent)
            }

            return .result()
        }
    }
    
    
}