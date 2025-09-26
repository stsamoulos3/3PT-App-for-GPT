//
//  Fizl_ActivityLiveActivity.swift
//  Fizl Activity
//
//  Created by Dominic on 2023-12-27.
//

import ActivityKit
import SwiftUI
import WidgetKit


struct FizlActivityView: View {
    let context: ActivityViewContext<FizlAttributes>
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        HStack {
            VStack(spacing: 10) {
                HStack {
                    Image(colorScheme == .dark ? "FizlIconWhite" : "FizlIcon")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 32, height: 32)
                    Text(context.state.headline)
                        .font(.headline)
                    Spacer()
                }
                .padding(.top)

              HStack {
                VStack(alignment: .leading, spacing: 5) {
                  Text(context.state.activityType)
                    .font(.title2)
                    .padding(.top, 5)
                  Text(context.state.title)
                    .font(.subheadline)
                    .foregroundColor(.gray)
                Text(context.state.breaks.map { $0.startTime.formatted(date: .omitted, time: .shortened) }.joined(separator: ", "))
                }
                Spacer()
              }

                if context.state.isPaused {
                    Text("Paused")
                        .font(.subheadline)
                        .foregroundColor(.red)
                        .padding(.top, 5)
                }

                HStack(spacing: 20) {
                  Text(timerInterval: context.state.startTime...context.state.endTime, countsDown: false, showsHours: false)
                      .font(.title)
                      .foregroundColor(.gray)
                    VStack {
                        Text("\(Int(context.state.calories))")
                            .font(.title3)
                            .bold()
                        Text("Calories")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                  if context.state.distance > 0 {
                    VStack {
                        Text(String(format: "%.1f", context.state.distance))
                            .font(.title3)
                            .bold()
                        Text("Miles")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                  }
                }
                .padding(.top, 5)

                Spacer()

                if context.state.isPaused {
                    Text("Timer Paused")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                } else {
                    ProgressView(timerInterval: context.state.startTime...context.state.endTime, countsDown: false)
                        .progressViewStyle(LinearProgressViewStyle())
                }

                Spacer()
            }
            .padding(.horizontal)

            Image("SmallListing")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .cornerRadius(10)
                .frame(width: 100)
                .padding()
        }
    }
}

struct FizlIslandBottom: View {
    let context: ActivityViewContext<FizlAttributes>

    var body: some View {
      VStack {
        HStack (alignment: VerticalAlignment.bottom){
              Text(timerInterval: context.state.startTime...context.state.endTime, countsDown: false, showsHours: false)
                  .font(.largeTitle)
                  .foregroundColor(.gray)
                VStack(spacing: 10) {
                    Spacer()

                    Text(context.state.activityType)
                        .font(.title3)

                    HStack(spacing: 15) {
                        Text("\(Int(context.state.calories)) cal")
                            .font(.subheadline)
                      if context.state.distance > 0 {
                        Text("•")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                        Text(String(format: "%.1f mi", context.state.distance))
                          .font(.subheadline)
                      }
                    }
                    .foregroundColor(.gray)
                }
                .padding(.horizontal)
            }
        }
    }
}

struct FizlWidget: Widget {
    let kind: String = "Fizl_Widget"

    var body: some WidgetConfiguration {
        ActivityConfiguration(for: FizlAttributes.self) { context in
            FizlActivityView(context: context)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Image("FizlIcon")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 36)
                        .padding(.leading)
                }
                DynamicIslandExpandedRegion(.trailing) {}
                DynamicIslandExpandedRegion(.bottom) {
                    FizlIslandBottom(context: context)
                }
            } compactLeading: {
              Text(timerInterval:context.state.startTime...context.state.endTime, countsDown: false,showsHours: false)
            } compactTrailing: {} minimal: {
                Image("FizlIcon")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 16)
            }
            // .widgetURL(URL(string: context.state.widgetUrl))
        }
    }
}

private extension FizlAttributes {
    static var preview: FizlAttributes {
        FizlAttributes()
    }
}

private extension FizlAttributes.ContentState {
    static var state: FizlAttributes.ContentState {
        FizlAttributes.ContentState(
            startTime: Date(timeIntervalSince1970: TimeInterval(1704300710)),
            endTime: Date(timeIntervalSince1970: TimeInterval(1704304310)),
            title: "Started at 11:54AM",
            headline: "Running",
            widgetUrl: "https://www.apple.com",
            isPaused: false,
            calories: 300,
            distance: 1,
            activityType: "Running",
            breaks: []
        )
    }
}

struct FizlActivityView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            FizlAttributes.preview
                .previewContext(FizlAttributes.ContentState.state, viewKind: .content)
                .previewDisplayName("Content View")

            FizlAttributes.preview
                .previewContext(FizlAttributes.ContentState.state, viewKind: .dynamicIsland(.compact))
                .previewDisplayName("Dynamic Island Compact")

            FizlAttributes.preview
                .previewContext(FizlAttributes.ContentState.state, viewKind: .dynamicIsland(.expanded))
                .previewDisplayName("Dynamic Island Expanded")

            FizlAttributes.preview
                .previewContext(FizlAttributes.ContentState.state, viewKind: .dynamicIsland(.minimal))
                .previewDisplayName("Dynamic Island Minimal")
        }
    }
}
